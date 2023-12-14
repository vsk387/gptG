import { UserButton, currentUser, auth } from "@clerk/nextjs";

//all functions in this page are from CLERK (imported from CLERK)
//<UserButton afterSignOutUrl="/"></UserButton>- where the user will go after singing out clerk function

const MemberProfile = async () => {
  const user = await currentUser();
  const { userId } = auth();
  return (
    <div className="px-4 flex items-center gap-2">
      <UserButton afterSignOutUrl="/" />
      <p>{user.emailAddresses[0].emailAddress}</p>
    </div>
  );
};
export default MemberProfile;
