# syntax=docker/dockerfile:1.4

# 1. For build React app
FROM node:lts AS development

# Set working directory
WORKDIR /app

# 
COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json

RUN yarn install

COPY . /app

ENV CI=true
ENV PORT=3000

CMD [ "yarn", "dev" ]

FROM development AS build

RUN yarn build


FROM development as dev-envs
# 更新容器中的软件包列表
# 安装 Git 软件包
# 请务必在同一运行语句中结合运行 apt-get update 和 apt-get install
RUN <<EOF
apt-get update
apt-get install -y --no-install-recommends git
EOF

# 创建了一个名为 vscode 的用户，并为该用户配置了默认的 shell 和主目录。
# -s /bin/bash：指定新用户的默认 shell 为 /bin/bash。Shell 是用户与操作系统交互的命令行解释器。
# -m：在创建用户时同时创建用户的主目录。

# 创建了一个名为 docker 的用户组
# 将用户 vscode 添加到 docker 用户组中
RUN <<EOF
useradd -s /bin/bash -m vscode
groupadd docker
usermod -aG docker vscode
EOF
# install Docker tools (cli, buildx, compose)
# 将源镜像 gloursdocker/docker 中根目录下的所有文件和子目录复制到当前镜像的根目录中。
# 将该基础镜像的全部内容作为正在构建的新 Docker 镜像的基础
COPY --from=gloursdocker/docker / /
CMD [ "yarn", "dev" ]

# 2. For Nginx setup
FROM nginx:alpine

# Copy config nginx
COPY --from=build /app/.nginx/nginx.conf /etc/nginx/conf.d/default.conf

WORKDIR /usr/share/nginx/html

# Remove default nginx static assets
RUN rm -rf ./*

# Copy static assets from builder stage
COPY --from=build /app/build .

# Containers run nginx with global directives and daemon off
ENTRYPOINT ["nginx", "-g", "daemon off;"]