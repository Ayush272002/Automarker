FROM gcc:latest

# Install bash and other necessary tools
RUN apt-get update && apt-get install -y \
    bash \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy files with appropriate permissions
COPY solution ./solution
COPY mark.sh ./mark.sh

# Make the script executable
RUN chmod +x mark.sh

# Run the marking script
CMD ["bash", "./mark.sh"]

