import { redirect } from "next/navigation";
import { serverSupabase } from "@/lib/supabase-server";
import AdminDashboard from "@/components/admin-dashboard";

export default async function AdminPage() {
  const supabase = await serverSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: admin } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!admin) redirect("/admin/login");

  const { data } = await supabase.from("photos").select("*").order("created_at", { ascending: false });
  return <AdminDashboard initialPhotos={data || []} />;
}
