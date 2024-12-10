FROM node:alpine

RUN apk add --no-cache bash

WORKDIR /app

COPY --chown=node:node sol.js ./sol.js
COPY --chown=node:node mark.sh ./mark.sh

RUN chmod +x mark.sh

CMD ["bash", "./mark.sh"]