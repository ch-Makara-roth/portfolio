import { PrismaClient } from '../generated/prisma';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Hash password for admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);

  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@chhuonmakararoth.site' },
    update: {},
    create: {
      email: 'admin@chhuonmakararoth.site',
      username: 'makaraadmin',
      password: hashedPassword,
      firstName: 'Makara',
      lastName: 'Chhuon',
      bio: 'Full Stack Developer specializing in modern web technologies',
      role: 'ADMIN',
      isActive: true,
    },
  });

  console.log('✅ Admin user created:', adminUser.email);

  // Create some sample blog posts
  const posts = [
    {
      title: 'Welcome to My Portfolio',
      content: 'This is my first blog post on my new portfolio website. I\'m excited to share my journey as a full-stack developer.',
      slug: 'welcome-to-my-portfolio',
      published: true,
      featured: true,
      tags: ['introduction', 'portfolio', 'web-development'],
    },
    {
      title: 'Building Modern Web Applications with Next.js',
      content: 'Next.js has revolutionized the way we build React applications. In this post, I\'ll share my experience building this portfolio.',
      slug: 'building-modern-web-applications-nextjs',
      published: true,
      featured: false,
      tags: ['nextjs', 'react', 'web-development', 'javascript'],
    },
    {
      title: 'The Power of TypeScript in Backend Development',
      content: 'TypeScript brings type safety to JavaScript, making backend development more robust and maintainable.',
      slug: 'power-of-typescript-backend-development',
      published: true,
      featured: false,
      tags: ['typescript', 'backend', 'nodejs', 'development'],
    },
  ];

  for (const postData of posts) {
    const post = await prisma.post.upsert({
      where: { slug: postData.slug },
      update: {},
      create: {
        ...postData,
        authorId: adminUser.id,
      },
    });
    console.log('✅ Post created:', post.title);
  }

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
