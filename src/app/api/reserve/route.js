import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const data = await request.json();
    const reservation = await prisma.reservation.create({
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email || null,
        class: data.class,
        message: data.message || null,
        date: new Date(data.date),
        time: data.time || '',
        people: parseInt(data.people, 10) || 1,
        status: 'pending',
        // userId 없이 비회원 예약
      },
    });
    return new Response(JSON.stringify({ result: 'success', reservation }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
} 
