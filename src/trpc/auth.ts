import { z } from 'zod';
import { router , publicProcedure } from './router';
import { hash, compare } from 'bcryptjs';


export const authRouter = router({
    register: publicProcedure
        .input(z.object({
            email: z.string().email(),
            password: z.string().min (6),
            name: z.string().min(1, "Name is required"),
        }))
        .mutation(async ({ ctx, input })=> {
            const hashedPassword = await hash(input.password, 10);

            const newUser = await ctx.db.user.create({
                data: {
                    email: input.email,
                    password: hashedPassword,
                    name: input.name,
                },
            });
            return { message: 'User registered successfully', user: newUser};
            }),

            login: publicProcedure
                .input(z.object({
                    email: z.string().email(),
                    password: z.string(),
                })
            )
            .mutation(async ({ ctx, input }) => {
                const user = await ctx.db.user.findUnique({
                    where: {email: input.email},
                });
                
                if (!user) {
                    throw new Error('Invalid email or password');
                }

                const valid = await compare(input.password, user.password);
                if (!valid) {
                    throw new Error('Invalid email or password');
                }

                return { message: 'Login successful', user};
                }),
            });
