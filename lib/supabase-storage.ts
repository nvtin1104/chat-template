import type { SupabaseClient } from '@supabase/supabase-js'
import { createSupabaseServerClient, createSupabaseScriptClient } from './supabase'

async function getSupabaseClient(): Promise<SupabaseClient> {
    try {
        return await createSupabaseServerClient()
    } catch (error) {
        return createSupabaseScriptClient()
    }
}

export async function uploadToSupabase(
    bucket: string,
    path: string,
    file: File | Blob | ArrayBuffer,
    options?: {
        contentType?: string
        upsert?: boolean
    }
) {
    try {
        const supabase = await getSupabaseClient()

        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(path, file, {
                contentType: options?.contentType,
                upsert: options?.upsert ?? false,
            })

        if (error) {
            throw error
        }

        const { data: urlData } = supabase.storage
            .from(bucket)
            .getPublicUrl(path)

        return {
            path: data.path,
            url: urlData.publicUrl,
        }
    } catch (error) {
        console.error('Error uploading to Supabase Storage:', error)
        throw error
    }
}

export async function deleteFromSupabase(bucket: string, path: string) {
    try {
        const supabase = await getSupabaseClient()

        const { error } = await (await supabase).storage
            .from(bucket)
            .remove([path])

        if (error) {
            throw error
        }

        return { success: true }
    } catch (error) {
        console.error('Error deleting from Supabase Storage:', error)
        throw error
    }
}

export async function getSupabasePublicUrl(bucket: string, path: string) {
    const supabase = await getSupabaseClient()
    const { data } = await supabase.storage
        .from(bucket)
        .getPublicUrl(path)

    return data.publicUrl
}

