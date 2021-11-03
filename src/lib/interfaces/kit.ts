import type { ServerRequest } from "@sveltejs/kit/types/hooks";
import type { Shop } from "@prisma/client";
import type { Session } from "@shopify/shopify-api/dist/auth/session";

export type ServerRequestWithLocals = ServerRequest<{ shop: Shop, session: Session }>;
