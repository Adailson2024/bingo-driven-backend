export function notFound(message = "Not found.") {
  return {
    name: "NotFound",
    message
  }
}

export function badRequest(message = "Bad Request.") {
  return {
    name: "BadRequest",
    message
  }
}