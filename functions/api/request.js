
export async function onRequestPost(context) {
  const GAS_URL = context.env.GAS_URL;

  try {
    const data = await context.request.json();

    const required = [
      "agent_name",
      "contact_name",
      "email",
      "start_date",
      "end_date",
      "teams_requested"
    ];

    for (const key of required) {
      if (!data[key]) {
        return json({ ok: false, error: `${key} is required` }, 400);
      }
    }

    if (new Date(data.end_date) < new Date(data.start_date)) {
      return json({ ok: false, error: "End date must be after start date" }, 400);
    }

    if (!GAS_URL) {
      return json({ ok: false, error: "GAS_URL is not set" }, 500);
    }

    const gasRes = await fetch(GAS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const result = await gasRes.json();

    return json(result, result.ok ? 200 : 500);

  } catch (err) {
    return json({ ok: false, error: err.message }, 500);
  }
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json"
    }
  });
}
