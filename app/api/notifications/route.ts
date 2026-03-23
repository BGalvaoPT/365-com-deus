import { NextResponse } from "next/server";
import webPush from "web-push";
import { createClient } from "@/lib/supabase/server";

// Configurar VAPID keys
if (process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webPush.setVapidDetails(
    process.env.VAPID_SUBJECT || "mailto:upcoach.pt@gmail.com",
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
}

// POST: Guardar subscription do utilizador
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const { subscription } = await request.json();

    await supabase
      .from("profiles")
      .update({
        push_subscription: subscription,
        notifications_enabled: true,
      })
      .eq("id", user.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao guardar subscription" },
      { status: 500 }
    );
  }
}

// GET: Enviar notificações a todos os utilizadores activos
// (chamado por um cron job ou scheduled function)
export async function GET(request: Request) {
  try {
    // Verificar API key simples para cron jobs
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const supabase = await createClient();

    // Buscar utilizadores com notificações activadas
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, push_subscription, notification_time")
      .eq("notifications_enabled", true)
      .not("push_subscription", "is", null);

    if (!profiles || profiles.length === 0) {
      return NextResponse.json({ sent: 0 });
    }

    let sent = 0;
    for (const profile of profiles) {
      try {
        await webPush.sendNotification(
          profile.push_subscription as any,
          JSON.stringify({
            title: "365 com Deus",
            body: "Hora do teu devocional. Abre a Palavra.",
            icon: "/icon-192.png",
            badge: "/icon-192.png",
            data: { url: "/devotional/today" },
          })
        );
        sent++;
      } catch (err) {
        // Subscription inválida — desactivar
        if ((err as any)?.statusCode === 410) {
          await supabase
            .from("profiles")
            .update({
              notifications_enabled: false,
              push_subscription: null,
            })
            .eq("id", profile.id);
        }
      }
    }

    return NextResponse.json({ sent });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao enviar notificações" },
      { status: 500 }
    );
  }
}
