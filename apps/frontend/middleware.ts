import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function middleware(request: NextRequest) {
  //return NextResponse.next();

  const url = request.nextUrl.clone();
  const path = request.nextUrl.pathname;

  if (!path.startsWith('/students/') && !path.startsWith('/marker/')) {
    return NextResponse.next();
  }

  let response = null;

  try {
    console.log('sending req');
    const res = await fetch(`${API_BASE_URL}/api/v1/users/user`, {
      headers: {
        Cookie: `jwt=${request.cookies.get('jwt')?.value}`,
      },
    });
    response = await res.json();
    response.status = res.status;
  } catch (error) {
    response = { status: 403 };
  }
  console.log(response);

  if (path.includes('/login')) {
    if (response.status == 200) {
      url.pathname = `/${response.role === 'STUDENT' ? 'students' : 'marker'}/dashboard`;
      return NextResponse.redirect(url);
    } else {
      const res = NextResponse.next();
      res.cookies.delete('jwt');
      return res;
    }
  } else {
    if (response.status == 200) {
      const correctPath = response.role === 'STUDENT' ? '/students' : '/marker';
      if (!path.includes(correctPath)) {
        console.log('redirecting to /');
        url.pathname = '/';
        return NextResponse.redirect(url);
      }
    } else {
      url.pathname = '/';
      const res = NextResponse.redirect(url);
      res.cookies.delete('jwt');
      return res;
    }
  }
  return NextResponse.next();
}
