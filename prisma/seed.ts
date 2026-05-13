import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const hashedPassword = await bcrypt.hash('agency123', 10)

    const admin = await prisma.user.upsert({
        where: { email: 'admin@inspiredacademy.com' },
        update: {},
        create: {
            email: 'admin@inspiredacademy.com',
            name: 'Agency Admin',
            password: hashedPassword,
            role: 'ADMIN',
        },
    })

    console.log('✅ Admin user created:', admin.email)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })