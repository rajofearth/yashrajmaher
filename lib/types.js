import { z } from "zod";

export const PostSchema = z.object({
	id: z.string(),
	slug: z.string(),
	title: z.string(),
	description: z.string(),
	featuredImage: z.string().optional().nullable(),
	content: z.string(),
	author: z.string(),
	authorImage: z.string().optional().nullable(),
	status: z.string(),
	website: z.string().optional().nullable(),
	tags: z.string().optional().nullable(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export const UserSchema = z.object({
	id: z.string(),
	name: z.string(),
	email: z.string(),
	emailVerified: z.boolean(),
	image: z.string().optional(),
	createdAt: z.date(),
	updatedAt: z.date(),
	sessions: z.array(z.lazy(() => SessionSchema)).optional(),
	accounts: z.array(z.lazy(() => AccountSchema)).optional(),
});

export const SessionSchema = z.object({
	id: z.string(),
	expiresAt: z.date(),
	token: z.string(),
	createdAt: z.date(),
	updatedAt: z.date(),
	ipAddress: z.string().optional(),
	userAgent: z.string().optional(),
	userId: z.string(),
	user: z.lazy(() => UserSchema).optional(),
});

export const AccountSchema = z.object({
	id: z.string(),
	accountId: z.string(),
	providerId: z.string(),
	userId: z.string(),
	user: z.lazy(() => UserSchema).optional(),
	accessToken: z.string().optional(),
	refreshToken: z.string().optional(),
	idToken: z.string().optional(),
	accessTokenExpiresAt: z.date().optional(),
	refreshTokenExpiresAt: z.date().optional(),
	scope: z.string().optional(),
	password: z.string().optional(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export const VerificationSchema = z.object({
	id: z.string(),
	identifier: z.string(),
	value: z.string(),
	expiresAt: z.date(),
	createdAt: z.date().optional(),
	updatedAt: z.date().optional(),
});
