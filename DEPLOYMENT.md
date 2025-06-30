# Netlify Deployment Guide

## Prerequisites
1. MongoDB Atlas database set up
2. Netlify account
3. GitHub repository with your project

## Environment Variables
Set these in your Netlify dashboard under Site settings > Environment variables:

```
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/database-name?retryWrites=true&w=majority
NEXTAUTH_URL=https://your-app-name.netlify.app
NEXTAUTH_SECRET=your-long-random-secret-key
```

## Deployment Steps

### 1. Connect Repository
- Go to Netlify dashboard
- Click "New site from Git"
- Connect your GitHub repository

### 2. Build Settings
The `netlify.toml` file is already configured with:
- Build command: `npm ci && npx prisma generate && npm run build`
- Publish directory: `.next`
- Node.js version: 18

### 3. Deploy
- Click "Deploy site"
- Monitor the build logs

## Troubleshooting

### Prisma Issues
- Binary targets are configured for Netlify in `prisma/schema.prisma`
- Environment variable `PRISMA_CLI_BINARY_TARGETS` is set in `netlify.toml`

### Build Failures
- Check that all environment variables are set
- Verify MongoDB Atlas connection string
- Ensure Node.js version is 18

### Runtime Issues
- Check function logs in Netlify dashboard
- Verify API routes are working
- Test authentication flow

## Files Modified for Deployment
- `prisma/schema.prisma` - Updated binary targets
- `netlify.toml` - Deployment configuration
- `package.json` - Build scripts
- `.env.example` - Environment variable template

## Post-Deployment
1. Test all functionality
2. Verify authentication works
3. Check database connections
4. Test CRUD operations

## Support
If you encounter issues:
1. Check Netlify function logs
2. Verify environment variables
3. Test API endpoints individually
4. Review MongoDB Atlas network access
