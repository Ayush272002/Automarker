FROM node:18-alpine

# Install bash
RUN apk add --no-cache bash

# Set working directory
WORKDIR /app

# Copy files with appropriate permissions
COPY --chown=node:node solution ./solution
COPY --chown=node:node mark.sh ./mark.sh

# Make the script executable
RUN chmod +x mark.sh

# Switch to non-root user
USER node

# Run the marking script
CMD ["bash", "./mark.sh"]