import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/user.model';

export async function POST() {
  try {
    await dbConnect();
    
    // Check if admin user already exists
    const existingUser = await User.findOne({ email: 'admin@privatediningpros.com' });
    
    if (existingUser) {
      return NextResponse.json({ message: 'Admin user already exists' });
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    const user = await User.create({
      name: 'Admin User',
      email: 'admin@privatediningpros.com',
      password: hashedPassword,
    });

    return NextResponse.json({ 
      message: 'Admin user created successfully',
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error('Error creating admin user:', error);
    return NextResponse.json({ error: 'Failed to create admin user' }, { status: 500 });
  }
} 