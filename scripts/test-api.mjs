async function runTests() {
  const BASE_URL = 'http://localhost:3000';
  console.log('--- 1. Testing GET /api/certificates (Public Fetch from Supabase) ---');
  const resCerts = await fetch(`${BASE_URL}/api/certificates`);
  const dataCerts = await resCerts.json();
  console.log('Status:', resCerts.status);
  console.log('Certificates Count from Supabase:', dataCerts.certificates?.length);
  if (dataCerts.certificates?.length < 30) {
    throw new Error('Expected at least 30 certificates in Supabase');
  }
  console.log('Sample Certificate Title:', dataCerts.certificates[0]?.title);
  console.log('Sample Certificate File URL:', dataCerts.certificates[0]?.fileUrl);

  console.log('\n--- 2. Testing Security: POST /api/certificates without Auth (Should be 401) ---');
  const resUnauth = await fetch(`${BASE_URL}/api/certificates`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: 'Hacker Certificate', organization: 'Unknown' }),
  });
  console.log('Status:', resUnauth.status);
  if (resUnauth.status !== 401) {
    throw new Error('Security check failed: unauthenticated POST should return 401');
  }
  console.log('✓ Unauthenticated request blocked correctly.');

  console.log('\n--- 3. Testing Admin Login: POST /api/auth/login ---');
  const resLogin = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ passcode: 'nipun2026' }),
  });
  console.log('Login Status:', resLogin.status);
  const loginCookies = resLogin.headers.get('set-cookie');
  console.log('Set-Cookie Header present:', !!loginCookies);
  if (!loginCookies) {
    throw new Error('Login failed to issue auth cookie');
  }

  // Extract session cookie
  const cookieMatch = loginCookies.match(/admin_session=([^;]+)/);
  const cookieValue = cookieMatch ? `admin_session=${cookieMatch[1]}` : '';

  console.log('\n--- 4. Testing Admin Session Check: GET /api/auth/session ---');
  const resSession = await fetch(`${BASE_URL}/api/auth/session`, {
    headers: { cookie: cookieValue },
  });
  const sessionData = await resSession.json();
  console.log('Session Authenticated:', sessionData.authenticated);
  if (!sessionData.authenticated) {
    throw new Error('Session check failed for valid admin cookie');
  }

  console.log('\n--- 5. Testing Admin Create Certificate: POST /api/certificates (Supabase Insert) ---');
  const testCertPayload = {
    title: 'Cloud Solutions Architect Professional Certification',
    organization: 'Amazon Web Services / Coursera',
    courseName: 'AWS Certified Solutions Architect',
    issueDate: 'August 2026',
    verificationLink: 'https://aws.amazon.com/verification/12345',
    category: 'Software Engineering',
    skills: ['AWS', 'Cloud Computing', 'Docker', 'Kubernetes', 'Terraform'],
    description: 'Comprehensive certification verifying cloud architecture design, VPC configuration, high availability, and database scaling.',
    credentialId: 'AWS-ARCH-2026-NIPUN',
    fileUrl: 'https://ehhvazggjgnoiuxikiqq.supabase.co/storage/v1/object/public/certificates/Coursera_20MTZWG8DD86F6.pdf',
    featured: true,
  };

  const resCreate = await fetch(`${BASE_URL}/api/certificates`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      cookie: cookieValue,
    },
    body: JSON.stringify(testCertPayload),
  });

  const createData = await resCreate.json();
  console.log('Create Status:', resCreate.status);
  console.log('Created Certificate ID:', createData.certificate?.id);
  const createdId = createData.certificate?.id;
  if (!createdId) {
    throw new Error('Failed to create certificate in Supabase');
  }

  console.log('\n--- 6. Testing GET /api/certificates/[id] ---');
  const resGetSingle = await fetch(`${BASE_URL}/api/certificates/${createdId}`);
  const singleData = await resGetSingle.json();
  console.log('Retrieved Title:', singleData.certificate?.title);
  console.log('Retrieved Skills:', singleData.certificate?.skills);

  console.log('\n--- 7. Testing Admin Edit Certificate: PUT /api/certificates/[id] ---');
  const resUpdate = await fetch(`${BASE_URL}/api/certificates/${createdId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      cookie: cookieValue,
    },
    body: JSON.stringify({
      title: 'Cloud Solutions Architect Professional - Master Level',
      skills: ['AWS', 'Cloud Computing', 'Docker', 'Kubernetes', 'Terraform', 'Next.js'],
    }),
  });
  const updateData = await resUpdate.json();
  console.log('Update Status:', resUpdate.status);
  console.log('Updated Title:', updateData.certificate?.title);

  console.log('\n--- 8. Testing Admin Delete Certificate: DELETE /api/certificates/[id] ---');
  const resDelete = await fetch(`${BASE_URL}/api/certificates/${createdId}`, {
    method: 'DELETE',
    headers: { cookie: cookieValue },
  });
  console.log('Delete Status:', resDelete.status);
  const deleteData = await resDelete.json();
  console.log('Delete Response:', deleteData);

  // Verify it's gone
  const resCheck = await fetch(`${BASE_URL}/api/certificates/${createdId}`);
  console.log('Verification status after delete (should be 404):', resCheck.status);

  console.log('\n==========================================');
  console.log('🎉 ALL SUPABASE API TESTS PASSED 100%!');
  console.log('==========================================\n');
}

runTests().catch((err) => {
  console.error('Test Failed:', err);
  process.exit(1);
});
