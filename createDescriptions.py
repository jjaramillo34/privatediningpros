from openai import OpenAI

client = OpenAI(
  api_key="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"
)

response = client.responses.create(
  model="gpt-5",
  input="""
  Create a markdown language description for the following restaurant:
  Please use the following information:
  Reseaarch the internet for the information you need to create the description, images, and amenities.
  Restaurant Name: Zuma New York
  Restaurant Address: 261 Madison Ave, New York, NY 10016
  Restaurant Price Range: Restaurant Price Range
  Restaurant Rating: Restaurant Rating
  Restaurant Cuisine: Restaurant Cuisine
  Restaurant Working Hours: Restaurant Working Hours
  Restaurant Contact: Restaurant Contact
  Restaurant Website: Restaurant Website
  Restaurant Social Media: Restaurant Social Media
  Restaurant Private Rooms: Restaurant Private Rooms
  Restaurant Capacity: Restaurant Capacity
  Please use the following format:
  ### Images of the restaurant 3 to 4 images of the restaurant in one row
  ### Amenities of the restaurant 3 to 4 amenities of the restaurant in one row
  ### Restaurant Name – Private Dining Overview
  Restaurant Description
  #### Room Capacities at a Glance
  All the rooms with their capacities and descriptions
  ### Facts about the restaurant for Events and Private Dining
  * Fact 1 - Fact Description
  * Fact 2 - Fact Description
  ### Additional information
  * Additional information 1 - Additional information Description
  * Additional information 2 - Additional information Description
  ### Short Description
  > *Short Description*
  ### Link sources for the images and amenities
  All the links to provide where you got the information from the internet.
  """,
  store=True,
  temperature=0.5,
  max_tokens=10000,
  top_p=1,
  frequency_penalty=0,
  presence_penalty=0,
  stop=None,
  n=1,
)

print(response.output_text);
