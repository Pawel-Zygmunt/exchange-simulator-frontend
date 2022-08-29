type Options = {
  request: Request;
  body: { [key: string]: string };
  searchParams: { [key: string]: string };
  inspect: boolean;
};

type ApiResponse = {
  response?: Response;
  status: number;
  ok: boolean;
  data: any;
  errors?: object;
};

const baseUrl = process.env.REACT_APP_API_URL;

export async function fetchApi(
  method: "GET" | "POST" | "PUT" | "DELETE",
  path: string,
  { request, body, searchParams, inspect = false }: Partial<Options> = {}
): Promise<ApiResponse> {
  const headers = new Headers();
  headers.set("Content-Type", "application/json");
  headers.set("Accept", "application/json");

  let url = baseUrl + path;
  if (searchParams) {
    const query = new URLSearchParams(
      Object.entries(searchParams).filter(([, value]) => value != null)
    );
    url += "?" + query.toString();
  }

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: JSON.stringify(body),
      credentials: "include",
    });

    let data: any = {};
    try {
      data = await response.json();
    } catch (err) {
      console.error("❌ No JSON data");
    }

    return {
      status: response.status,
      ok: response.ok,
      data: data,
      errors: data?.errors,
    };
  } catch (err) {
    console.log(err);
    return {
      status: 500,
      ok: false,
      data: undefined,
      errors: undefined,
    };
  }
}
