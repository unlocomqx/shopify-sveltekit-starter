import { Shopify } from "@shopify/shopify-api";
import type { ServerRequest } from "@sveltejs/kit/types/hooks";
import Cookies from "cookies";
import type { DefaultContext } from "koa";

export function convert(request: ServerRequest): DefaultContext {
  let ctx: DefaultContext = null;

  function fixCookie(cookie: string): string {
    if (!cookie.includes("path=")) {
      cookie = `${cookie}; path=/`;
    }
    if (!cookie.includes("samesite=")) {
      cookie = `${cookie}; samesite=lax`;
    }
    if (!cookie.includes("secure;")) {
      cookie = `${cookie}; secure`;
    }
    if (!cookie.includes("httponly")) {
      cookie = `${cookie}; httponly`;
    }
    return cookie;
  }


  ctx = {
    host: request.host,
    path: request.path,
    query: Object.fromEntries(request.query as any),
    req: {
      ...request,
    },
    res: {
      getHeader: (header) => {
        return ctx.headers[header];
      },
      setHeader,
    },
    response: {
      status: null,
      set: setHeader,
      headers: request.headers,
    },
    header: request.headers,
    headers: request.headers,
    connection: {
      encrypted: true,
    },
    state: {},
    redirect: (url) => {
      ctx.status = 302;
      ctx.headers["location"] = url;
    },
    status: 200,
    throw: function(code: number) {
      ctx.status = code;
    },
  };

  if (request.headers.cookie) {
    ctx.headers["set-cookie"] = request.headers.cookie.split(";")
      .map((s) => s.trim())
      .map(fixCookie);
  }
  ctx.cookies = new Cookies(
    ctx as any,
    ctx.res,
    {
      keys: [Shopify.Context.API_SECRET_KEY],
      secure: true,
    },
  );

  function setHeader(header: string, value: string | string[]) {
    header = header.toLowerCase();
    if (header === "set-cookie") {
      const cookies: string[] = ctx.headers["set-cookie"] || [];
      // remove duplicates
      (value as string[]).forEach(cookie => {
        const cookie_name = cookie.split("=")?.[0];
        for (let i = cookies.length - 1; i >= 0; i--) {
          if (cookies[i].indexOf(cookie_name + "=") === 0) {
            cookies.splice(i, 1);
          }
        }
      });
      let cookie_values: string[] = (value as string[]).map(fixCookie);
      cookie_values = [...cookies, ...value];
      ctx.headers.cookie = cookie_values.join(";");
    }
    ctx.headers[header] = value;
    ctx.response.headers = ctx.headers;
  };

  return ctx;
}
