import { z } from 'zod';
import { Hono } from "hono";
import { ID, Query } from 'node-appwrite';

import { zValidator } from "@hono/zod-validator";

import { sessionMiddleware } from "@/lib/session-middleware";
import { getMember } from '@/features/members/utils';
import { MemberRole } from '@/features/members/types';
import { DATABASE_ID, IMAGES_BUCKET_ID, MEMBERS_ID, PROJECTS_ID, WORKSPACES_ID } from '@/config';
import { createProjectSchema } from '../schemas';
import { generateInviteCode } from '@/lib/utils';

const app = new Hono()
    .get(
        '/',
        sessionMiddleware,
        zValidator('query', z.object({ workspaceId: z.string() })),
        async (c) => {
            const user = c.get('user');
            const databases = c.get('databases');

            const { workspaceId } = c.req.valid('query');

            if(!workspaceId) return c.json({ error: 'Missing Workspace'}, 400)

            const member = await getMember({
                databases,
                workspaceId,
                userId: user.$id,
            });

            if(!member) return c.json({ error: 'Unauthorized'}, 401);

            const projects = await databases.listDocuments(
                DATABASE_ID,
                PROJECTS_ID,
                [
                    Query.equal('workspaceId', workspaceId),
                    Query.orderDesc('$createdAt')
                ]
            );

            return c.json({ data: projects });
        }
    )
    .post(
        '/',
        sessionMiddleware,
        zValidator('form', createProjectSchema),
        async (c) => {
            const databases = c.get('databases');
            const storage = c.get('storage');
            const user = c.get('user');

            const { name, image, workspaceId } = c.req.valid('form');

            const member = await getMember({
                databases,
                workspaceId,
                userId: user.$id
            });

            if(!member) return c.json({ error: 'Unauthorized' }, 401)
            
            let uploadedImageUrl: string | undefined;

            if(image instanceof File) {
                const file = await storage.createFile(
                    IMAGES_BUCKET_ID,
                    ID.unique(),
                    image
                );
                
                const arrayBuffer = await storage.getFilePreview(
                    IMAGES_BUCKET_ID,
                    file.$id
                );

                uploadedImageUrl = `data:image/png;base64,${Buffer.from(arrayBuffer).toString('base64')}`
            };
                
            const project = await databases.createDocument(
                DATABASE_ID,
                PROJECTS_ID,
                ID.unique(),
                { 
                    name,
                    imageUrl: uploadedImageUrl,
                    workspaceId
                },
            );

           return c.json({ data: project });
        }
    )
export default app;