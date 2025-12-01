package web

import (
	"github.com/gin-gonic/gin" // or "github.com/gofiber/fiber/v2" for Fiber
)

func SetupRouter() *gin.Engine { // Change to *fiber.App if using Fiber
	router := gin.Default() // or fiber.New() for Fiber

	// Define your routes here
	router.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Welcome to the API!",
		})
	})

	return router // Return the router instance
}
