import VerifyUI from '@/components/auth/verify/VerifyUI';

const VerifyPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  return <VerifyUI id={id} />;
};

export default VerifyPage;
