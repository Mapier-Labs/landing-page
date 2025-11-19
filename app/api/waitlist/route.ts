import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name } = body;

    if (!email || !name) {
      return NextResponse.json(
        { error: '邮箱和姓名都是必填项' },
        { status: 400 }
      );
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: '请输入有效的邮箱地址' },
        { status: 400 }
      );
    }

    // 这里可以将数据保存到数据库或发送到外部服务
    // 目前先返回成功，后续可以集成Vercel KV、数据库或其他服务
    // 例如：await saveToDatabase({ email, name, timestamp: new Date() });
    
    // 可以集成以下服务之一：
    // 1. Vercel KV (Redis)
    // 2. Airtable
    // 3. Google Sheets API
    // 4. 自定义数据库

    console.log('Waitlist submission:', { email, name, timestamp: new Date().toISOString() });

    return NextResponse.json(
      { 
        success: true, 
        message: '成功加入等待列表！',
        data: { email, name }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Waitlist API error:', error);
    return NextResponse.json(
      { error: '服务器错误，请稍后重试' },
      { status: 500 }
    );
  }
}

