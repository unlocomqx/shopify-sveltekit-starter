// this action (https://svelte.dev/tutorial/actions) allows us to
// progressively enhance a <form> that already works without JS
import { authenticatedFetch } from "$lib/shopify/fetch";
import type { FormEnhanceParams } from "@interfaces/form";

function toBase64(file): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.toString());
    reader.onerror = error => reject(error);
  });
}

async function convertFormData(formData: FormData) {
  const result: FormData = new FormData();
  for (const [name, value] of formData.entries()) {
    if (value instanceof File) {
      result.append(name, JSON.stringify({
        name: value.name,
        type: value.type,
        data: await toBase64(value),
      }));
    } else {
      result.append(name, value);
    }
  }
  return result;
}

export function enhance(form: HTMLFormElement, { pending, error, result }: FormEnhanceParams = {}) {
  let current_token;

  async function handle_submit(e: Event) {
    const token = (current_token = {});

    e.preventDefault();

    const body = new FormData(form);

    const convertedBody = await convertFormData(body);

    if (pending) pending(convertedBody, form);

    try {
      const fetchFunction = authenticatedFetch();
      const url = form.action + (convertedBody.get("endpoint") || "");
      const res = await fetchFunction(url, {
        method: form.method,
        headers: {
          accept: "application/json",
        },
        body: convertedBody,
      });

      if (token !== current_token) return;

      if (res.ok) {
        if (result) result(res, form);
      } else if (error) {
        error(res, null, form);
      } else {
        // eslint-disable-next-line no-console
        console.error(await res.text());
      }
    } catch (e) {
      if (error) {
        error(null, e, form);
      } else {
        throw e;
      }
    }
  }

  form.addEventListener("submit", handle_submit);

  return {
    destroy() {
      form.removeEventListener("submit", handle_submit);
    },
  };
}

export async function submit(form): Promise<Response> {
  let current_token;

  const token = (current_token = {});

  const body = new FormData(form);

  const fetchFunction = authenticatedFetch();
  const res = await fetchFunction(form.action, {
    method: form.method,
    headers: {
      accept: "application/json",
    },
    body,
  });

  if (token !== current_token) return;

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res;
}

export function getFormData(obj: { [key: string]: any }) {
  const formData = new FormData();
  Object.entries(obj).forEach(([key, value]) => {
    formData.append(key, value);
  });
  return formData;
}
