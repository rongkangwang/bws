FROM centos
RUN yum install -y epel-release
RUN yum install -y nodejs
RUN mkdir /server
EXPOSE 3001
WORKDIR /server
COPY ./ /server
RUN npm install
CMD npm start
