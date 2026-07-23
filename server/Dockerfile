# ---------- BUILD STAGE ----------
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /app

# Copy 
COPY *.csproj ./
RUN dotnet restore

# Copy and build
COPY . ./
RUN dotnet publish -c Release -o out --no-restore

# RUNTIME 
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app

# Copy the published output
COPY --from=build /app/out ./

# Expose port 
ENV ASPNETCORE_URLS=http://+:5132
EXPOSE 5132

ENTRYPOINT ["dotnet", "server.dll"]
