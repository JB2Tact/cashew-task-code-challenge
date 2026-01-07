import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST() {
  try {
    console.log('Starting database reset...');

    // Delete all tasks first (due to foreign key constraints)
    await prisma.task.deleteMany({});
    console.log('Deleted all tasks');

    // Delete all users
    await prisma.user.deleteMany({});
    console.log('Deleted all users');

    // Recreate users with avatars
    const alice = await prisma.user.create({
      data: {
        id: '1',
        name: 'Alice',
        email: 'alice@example.com',
        avatar: '/avatars/alice.svg',
      },
    });

    const bob = await prisma.user.create({
      data: {
        id: '2',
        name: 'Bob',
        email: 'bob@example.com',
        avatar: '/avatars/bob.svg',
      },
    });

    const charlie = await prisma.user.create({
      data: {
        id: '3',
        name: 'Charlie',
        email: 'charlie@example.com',
        avatar: '/avatars/charlie.svg',
      },
    });

    const diana = await prisma.user.create({
      data: {
        id: '4',
        name: 'Diana',
        email: 'diana@example.com',
        avatar: '/avatars/diana.svg',
      },
    });

    console.log('Created users:', { alice, bob, charlie, diana });

    // Create tasks for Alice
    const aliceTasks = await Promise.all([
      prisma.task.create({
        data: {
          title: 'Review pull requests',
          description: 'Check the pending PRs in the repository',
          authorId: alice.id,
          completed: false,
        },
      }),
      prisma.task.create({
        data: {
          title: 'Update documentation',
          description: 'Add examples to the README',
          authorId: alice.id,
          completed: true,
        },
      }),
      prisma.task.create({
        data: {
          title: 'Fix bug in authentication',
          description: 'Users are reporting login issues',
          authorId: alice.id,
          completed: false,
        },
      }),
      prisma.task.create({
        data: {
          title: 'Prepare quarterly presentation',
          description: 'Create slides for the Q1 review meeting',
          authorId: alice.id,
          completed: false,
        },
      }),
      prisma.task.create({
        data: {
          title: 'Code review for new feature',
          authorId: alice.id,
          completed: true,
        },
      }),
    ]);

    // Create tasks for Bob
    const bobTasks = await Promise.all([
      prisma.task.create({
        data: {
          title: 'Design new landing page',
          description: 'Create mockups for the new homepage',
          authorId: bob.id,
          completed: false,
        },
      }),
      prisma.task.create({
        data: {
          title: 'Write unit tests',
          description: 'Add tests for the new features',
          authorId: bob.id,
          completed: false,
        },
      }),
      prisma.task.create({
        data: {
          title: 'Refactor API endpoints',
          description: 'Clean up the REST API structure',
          authorId: bob.id,
          completed: true,
        },
      }),
      prisma.task.create({
        data: {
          title: 'Set up CI/CD pipeline',
          authorId: bob.id,
          completed: false,
        },
      }),
    ]);

    // Create tasks for Charlie
    const charlieTasks = await Promise.all([
      prisma.task.create({
        data: {
          title: 'Database optimization',
          description: 'Analyze and optimize slow queries',
          authorId: charlie.id,
          completed: false,
        },
      }),
      prisma.task.create({
        data: {
          title: 'Security audit',
          description: 'Review application for security vulnerabilities',
          authorId: charlie.id,
          completed: false,
        },
      }),
      prisma.task.create({
        data: {
          title: 'Update dependencies',
          authorId: charlie.id,
          completed: true,
        },
      }),
    ]);

    // Create tasks for Diana
    const dianaTasks = await Promise.all([
      prisma.task.create({
        data: {
          title: 'User research interviews',
          description: 'Schedule and conduct 5 user interviews',
          authorId: diana.id,
          completed: false,
        },
      }),
      prisma.task.create({
        data: {
          title: 'Create user personas',
          description: 'Document key user types and their needs',
          authorId: diana.id,
          completed: true,
        },
      }),
      prisma.task.create({
        data: {
          title: 'Accessibility improvements',
          description: 'Implement WCAG 2.1 AA compliance',
          authorId: diana.id,
          completed: false,
        },
      }),
      prisma.task.create({
        data: {
          title: 'Mobile responsive design',
          authorId: diana.id,
          completed: false,
        },
      }),
    ]);

    console.log('Created tasks for Alice:', aliceTasks.length);
    console.log('Created tasks for Bob:', bobTasks.length);
    console.log('Created tasks for Charlie:', charlieTasks.length);
    console.log('Created tasks for Diana:', dianaTasks.length);
    console.log('Database reset completed!');

    return NextResponse.json({ 
      success: true, 
      message: 'Database reset successfully',
      stats: {
        users: 4,
        tasks: aliceTasks.length + bobTasks.length + charlieTasks.length + dianaTasks.length
      }
    });
  } catch (error) {
    console.error('Error resetting database:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to reset database',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

