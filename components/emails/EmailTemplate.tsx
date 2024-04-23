function EmailTemplate({
  firstname,
  lastname,
  email,
  phone,
  message,
}: Readonly<{
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  message: string;
}>) {
  return (
    <div>
      <h1 className="tracking-tight font-semibold text-2xl scroll-m-20">
        {firstname} {lastname}
      </h1>
      <p>Email: {email}</p>
      <p>Phone: {phone}</p>
      <p>Message: {message}</p>
    </div>
  );
}

export default EmailTemplate;
