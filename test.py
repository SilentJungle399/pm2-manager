from discord.ext import commands

bot = commands.Bot(command_prefix='?')

@bot.event
async def on_ready():
	print("The bot is ready!")
	print("run 2")

class TestException(Exception):
	pass

@bot.command()
async def test(ctx):
	await ctx.send("test")
	print("Boi test")

bot.run("NzQwNTY4NzY2MTk4NDQ4MTkw.Xyq6aA.ryjwwbMeF8rUnjBJwZiLP3_uaAk")