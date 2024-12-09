FROM node:alpine

RUN apk add --no-cache bash

WORKDIR /app

COPY sol.js ./
COPY mark.sh ./

RUN chmod +x mark.sh

CMD ["bash", "mark.sh"]