// Re-export auth from NextAuth route
// In NextAuth v5, auth is already a function that can be called directly
export { auth } from "@/app/api/auth/[...nextauth]/route"

