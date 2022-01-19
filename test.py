from discord.ext import commands

bot = commands.Bot(command_prefix='?')

@bot.event
async def on_ready():
	print("The bot is ready!")

class TestException(Exception):
	pass

@bot.command()
async def log(ctx, val: int):
	await ctx.send("log")
	for i in range(val):
		print("hehehe", i)

@bot.command()
async def error(ctx):
	await ctx.send("err")
	raise TestException("test")

bot.run("NzQwNTY4NzY2MTk4NDQ4MTkw.Xyq6aA.ryjwwbMeF8rUnjBJwZiLP3_uaAk")