# ---------- Builder Stage ----------
FROM node:25 AS builder
WORKDIR /usr/src/app

# Copy full monorepo
COPY 15sec_core 15sec_core
COPY 15sec_post 15sec_post

# Install deps
RUN cd 15sec_core && npm install
RUN cd 15sec_post && npm install

# Build core
RUN cd 15sec_core && npx prisma generate && npm run build

# Copy the built core into post's node_modules
RUN mkdir -p 15sec_post/node_modules/15sec_core
RUN cp -r 15sec_core/dist 15sec_post/node_modules/15sec_core/
RUN cp -r 15sec_core/generated 15sec_post/node_modules/15sec_core/

# Build post (will reference built core)
RUN cd 15sec_post && npm run build


# ---------- Runtime Stage ----------
FROM node:25-alpine AS runtime
WORKDIR /usr/src/app/15sec_post

# Copy post package files
COPY --from=builder /usr/src/app/15sec_post/package*.json ./

# Install ONLY production deps
RUN npm install --omit=dev

# Copy post build output
COPY --from=builder /usr/src/app/15sec_post/dist ./dist

# Copy built core into runtime (AFTER install so it doesn't get wiped)
COPY --from=builder /usr/src/app/15sec_core/dist ./node_modules/15sec_core/dist
COPY --from=builder /usr/src/app/15sec_core/generated ./node_modules/15sec_core/generated

CMD ["node", "dist/main.js"]
