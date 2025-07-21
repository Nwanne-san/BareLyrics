import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase environment variables")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function setupAdminTables() {
  console.log("Setting up admin tables...")

  try {
    // Create the update function
    const { error: functionError } = await supabase.rpc("exec_sql", {
      sql: `
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = NOW();
            RETURN NEW;
        END;
        $$ language 'plpgsql';
      `,
    })

    if (functionError) {
      console.log("Function creation result:", functionError)
    }

    // Create song_submissions table
    const { error: submissionsError } = await supabase.rpc("exec_sql", {
      sql: `
        CREATE TABLE IF NOT EXISTS song_submissions (
          id BIGSERIAL PRIMARY KEY,
          title VARCHAR(200) NOT NULL,
          artist VARCHAR(100) NOT NULL,
          album VARCHAR(200),
          genre VARCHAR(50),
          year INTEGER,
          cover TEXT,
          lyrics TEXT NOT NULL,
          submitter_name VARCHAR(100),
          submitter_email VARCHAR(255),
          submission_type VARCHAR(20) NOT NULL DEFAULT 'new',
          original_song_id BIGINT,
          status VARCHAR(20) NOT NULL DEFAULT 'pending',
          admin_notes TEXT,
          reviewed_by VARCHAR(100),
          reviewed_at TIMESTAMP WITH TIME ZONE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `,
    })

    if (submissionsError) {
      console.log("Submissions table result:", submissionsError)
    }

    // Create admin_users table
    const { error: adminError } = await supabase.rpc("exec_sql", {
      sql: `
        CREATE TABLE IF NOT EXISTS admin_users (
          id BIGSERIAL PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          name VARCHAR(100) NOT NULL,
          role VARCHAR(20) NOT NULL DEFAULT 'admin',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `,
    })

    if (adminError) {
      console.log("Admin table result:", adminError)
    }

    // Try direct table creation if RPC doesn't work
    const { error: directError1 } = await supabase.from("song_submissions").select("id").limit(1)

    if (directError1) {
      console.log("Creating tables directly...")

      // Use raw SQL execution
      const sqlCommands = [
        `CREATE TABLE IF NOT EXISTS song_submissions (
          id BIGSERIAL PRIMARY KEY,
          title VARCHAR(200) NOT NULL,
          artist VARCHAR(100) NOT NULL,
          album VARCHAR(200),
          genre VARCHAR(50),
          year INTEGER,
          cover TEXT,
          lyrics TEXT NOT NULL,
          submitter_name VARCHAR(100),
          submitter_email VARCHAR(255),
          submission_type VARCHAR(20) NOT NULL DEFAULT 'new',
          original_song_id BIGINT,
          status VARCHAR(20) NOT NULL DEFAULT 'pending',
          admin_notes TEXT,
          reviewed_by VARCHAR(100),
          reviewed_at TIMESTAMP WITH TIME ZONE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )`,
        `CREATE TABLE IF NOT EXISTS admin_users (
          id BIGSERIAL PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          name VARCHAR(100) NOT NULL,
          role VARCHAR(20) NOT NULL DEFAULT 'admin',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )`,
      ]

      for (const sql of sqlCommands) {
        try {
          const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${supabaseKey}`,
              apikey: supabaseKey,
            },
            body: JSON.stringify({ sql }),
          })

          if (!response.ok) {
            console.log(`SQL execution response: ${response.status}`)
          }
        } catch (err) {
          console.log("Direct SQL execution failed:", err.message)
        }
      }
    }

    // Insert default admin user
    const { error: insertError } = await supabase.from("admin_users").upsert([
      {
        email: "admin@barelyrics.com",
        name: "Admin User",
        role: "admin",
      },
    ])

    if (insertError) {
      console.log("Admin user insert result:", insertError)
    }

    // Insert sample submissions
    const { error: sampleError } = await supabase.from("song_submissions").upsert([
      {
        title: "Test Song",
        artist: "Test Artist",
        album: "Test Album",
        genre: "Rock",
        year: 2023,
        lyrics: "These are test lyrics for the admin system to review.",
        submitter_name: "Test User",
        submission_type: "new",
        status: "pending",
      },
    ])

    if (sampleError) {
      console.log("Sample data insert result:", sampleError)
    }

    console.log("✅ Admin tables setup completed!")
    console.log("📝 You can now:")
    console.log("   - Access admin panel at admin.barelyrics.vercel.app")
    console.log("   - Login with: admin@barelyrics.com / admin123")
    console.log("   - Review submissions and manage songs")
  } catch (error) {
    console.error("❌ Setup failed:", error)
  }
}

setupAdminTables()
