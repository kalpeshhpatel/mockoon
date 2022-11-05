export const DOCKER_TEMPLATE = `FROM node:16-alpine

# Set the npm registry
RUN npm config set registry https://build-artifactory.eng.vmware.com/artifactory/api/npm/npm

RUN npm install -g @mockoon/cli@{{{version}}}
{{#filePaths}}
COPY {{{.}}} ./{{{.}}}
{{/filePaths}}

# Copy All the data files present in ./data directory...
COPY noop data* ./data/

# Do not run as root.
RUN adduser --shell /bin/sh --disabled-password --gecos "" mockoon
{{#filePaths}}
RUN chown -R mockoon ./{{{.}}}
{{/filePaths}}

# Change ownership and permission for ./data directory...
RUN chown -R mockoon ./data
RUN chmod 777 ./data

USER mockoon

EXPOSE{{#ports}} {{.}}{{/ports}}

ENTRYPOINT ["mockoon-cli", "start", "--hostname", "0.0.0.0", "--daemon-off", "--data", {{#filePaths}}"{{.}}", {{/filePaths}}"--container"{{{args}}}]

# Usage: docker run -p <host_port>:<container_port> mockoon-test`;
