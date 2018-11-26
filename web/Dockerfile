FROM centos
RUN yum install -y epel-release
RUN yum install -y nodejs
RUN mkdir /web
EXPOSE 80
WORKDIR /web
COPY ./ /web
RUN rm -rf /web/node_modules
RUN npm install
ENTRYPOINT ["/web/docker/docker_entrypoint.sh"]
CMD npm start
