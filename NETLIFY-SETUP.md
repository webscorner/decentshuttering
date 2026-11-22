# Netlify publishing and blog editing

This site is configured as a static Netlify site with Decap CMS for blog editing. It does not need a paid plan, build command, Node installation, or API key. The CMS saves blog changes to the connected Git repository; Netlify then publishes the updated site.

## Publish the site

1. Put the complete contents of this folder in a GitHub repository. Keep `index.html`, `netlify.toml`, `admin/`, `content/`, and `images/` at the repository root.
2. In Netlify, choose **Add new site** / **Import an existing project**, connect GitHub, and select the repository.
3. Use the repository's `main` branch and leave the build command empty. The publish directory is `.` and is already configured in `netlify.toml`.
4. Deploy the site and open the Netlify-provided URL. Netlify will redeploy when a blog post is saved.

## Enable the blog editor

1. In the Netlify site dashboard, enable **Identity** and set registration to **Invite only**.
2. Under Identity, enable **Git Gateway**.
3. Invite the email address that should manage the blog and accept the invitation.
4. Visit `https://YOUR-SITE.netlify.app/admin/` and sign in to create, edit, or remove posts.

Posts are managed in **Blog → Blog posts**. Fill in the title, a unique lowercase URL slug, publication date, category, cover image, image description, short summary, and article text. Separate article paragraphs with a blank line. Saving publishes the post through Git and triggers a Netlify deploy.

## Important

- The CMS requires a Git-connected Netlify site. A drag-and-drop/manual deploy alone cannot save CMS edits back to the site.
- The CMS uses Netlify Identity and Git Gateway. Complete the Identity and Git Gateway setup before signing in to `/admin/`.
- The website's enquiry form continues to use FormSubmit; blog publishing is a separate workflow.
