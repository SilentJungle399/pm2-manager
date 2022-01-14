from discord.ext import commands

bot = commands.Bot(command_prefix='!')

@bot.event
async def on_ready():
	print("The bot is ready!")

bot.run("NzQwNTY4NzY2MTk4NDQ4MTkw.Xyq6aA.ryjwwbMeF8rUnjBJwZiLP3_uaAk")