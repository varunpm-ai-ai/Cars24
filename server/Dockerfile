FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /app

COPY server/*.csproj ./
RUN dotnet restore

COPY server/. ./
RUN dotnet publish -c Release -o out --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app

COPY --from=build /app/out ./

ENV ASPNETCORE_URLS=http://+:5132
EXPOSE 5132

ENTRYPOINT ["dotnet", "server.dll"]