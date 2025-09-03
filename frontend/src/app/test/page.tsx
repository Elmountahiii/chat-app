import { FriendsDialog } from "@/components/chat/FriendsDialog";

function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 relative overflow-hidden">
      <FriendsDialog />
    </div>
  );
}

export default Page;
