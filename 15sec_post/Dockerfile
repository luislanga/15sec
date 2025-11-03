FROM node:25 AS builder
WORKDIR /usr/src/app

# Copy node package files (core and post)
COPY 15sec_core/package*.json 15sec_core/
COPY 15sec_post/package*.json 15sec_post/

# Install deps
RUN cd 15sec_core && npm install
RUN cd 15sec_post && npm install

# Copy source
COPY 15sec_core 15sec_core
COPY 15sec_post 15sec_post

# Build core and prisma generate
RUN cd 15sec_core && npm run build
RUN cd 15sec_core && npx prisma generate

# Copy core build output into post
RUN cp -r 15sec_core/dist 15sec_post/node_modules/15sec_core
RUN cp -r 15sec_core/generated 15sec_post/node_modules/15sec_core

# Build post
RUN cd 15sec_post && npm run build

# Stage 2
FROM node:25-alpine AS runtime

WORKDIR /usr/src/app

# Copy runtime deps
COPY --from=builder /usr/src/app/15sec_post/package*.json ./15sec_post/

# Install only production dependencies
RUN cd 15sec_post && npm install --omit=dev

# Copy core and Prisma generated files to node_modules and the post build
COPY --from=builder /usr/src/app/15sec_core/dist ./15sec_post/node_modules/15sec_core/dist
COPY --from=builder /usr/src/app/15sec_core/generated ./15sec_post/node_modules/15sec_core/generated
COPY --from=builder /usr/src/app/15sec_post/dist ./15sec_post/dist

WORKDIR /usr/src/app/15sec_post

CMD ["node", "dist/main.js"]