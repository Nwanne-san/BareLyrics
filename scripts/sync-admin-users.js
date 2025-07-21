// import { createClient } from "@supabase/supabase-js"
// import bcrypt from "bcryptjs"

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
// const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// if (!supabaseUrl || !supabaseKey) {
//   console.error("Missing Supabase environment variables")
//   process.exit(1)
// }

// const supabase = createClient(supabaseUrl, supabaseKey)

// // Hash password function
// async function hashPassword(password) {
//   const saltRounds = 12
//   return await bcrypt.hash(password, saltRounds)
// }

// async function syncEnvironmentUsersToDatabase() {
//   console.log("🔄 Syncing environment admin users to database...")

//   try {
//     const environmentUsers = [
//       {
//         email: process.env.ADMIN_EMAIL ,
//         // name: "Primary Admin",
//         password: process.env.ADMIN_PASSWORD ,
//         role: "admin",
//       },
//       {
//         email: process.env.DEVELOPER_EMAIL,
//         // name: "Developer",
//         password: process.env.DEVELOPER_PASSWORD,
//         role: "developer",
//       },
//     ]

//     for (const user of environmentUsers) {
//       if (user.email && user.password) {
//         console.log(`📝 Processing ${user.role}: ${user.email}`)

//         const passwordHash = await hashPassword(user.password)

//         // Upsert user to database
//         const { data, error } = await supabase
//           .from("admin_users")
//           .upsert(
//             [
//               {
//                 email: user.email,
//                 name: user.name,
//                 password_hash: passwordHash,
//                 role: user.role,
//               },
//             ],
//             {
//               onConflict: "email",
//               ignoreDuplicates: false,
//             },
//           )
//           .select()

//         if (error) {
//           console.error(`❌ Failed to sync ${user.role}:`, error.message)
//         } else {
//           console.log(`✅ Successfully synced ${user.role} (${user.email}) to database`)
//         }
//       } else {
//         console.warn(`⚠️  Missing credentials for ${user.role}`)
//       }
//     }

//     console.log("🎉 Environment user sync completed!")
//     console.log("\n📋 Next steps:")
//     console.log("1. You can now login with your environment credentials")
//     console.log("2. The passwords are securely hashed in the database")
//     console.log("3. Environment variables are still the source of truth")
//     console.log("4. Access admin panel at admin.barelyrics.vercel.app")
//   } catch (error) {
//     console.error("❌ Sync failed:", error)
//   }
// }

// syncEnvironmentUsersToDatabase()
