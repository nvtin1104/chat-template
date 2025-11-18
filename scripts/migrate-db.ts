import { createSupabaseAdminClient } from '@/lib/supabase'
import { readFileSync } from 'fs'
import { join } from 'path'
import { config } from 'dotenv'
import { resolve } from 'path'

config({ path: resolve(process.cwd(), '.env.local') })

async function migrate() {
    try {

        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
            process.exit(1)
        }

        const migrationPath = join(process.cwd(), 'supabase', 'migrations', '001_initial_schema.sql')
        const sql = readFileSync(migrationPath, 'utf-8')

        console.log(sql)
    } catch (error) {
        process.exit(1)
    }
}

migrate()

