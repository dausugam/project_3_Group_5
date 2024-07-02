# Import Library Dependancies
import pandas
import json

# Read Data from source file
schools = pandas.read_excel("../source_data/WA_schools_data.xlsx", skiprows=27)

# Delete last row (page number)
schools = schools.drop(schools.index[-1])

# Change column types
schools["Code"] = schools["Code"].astype(int)
schools["Postcode"] = schools["Postcode"].astype(int)

# Convert Uppercase text to Capitalize each word
schools["School Name"] = schools["School Name"].str.title()
schools["Street"] = schools["Street"].str.title()
schools["Suburb"] = schools["Suburb"].str.title()
schools["Education Region"] = schools["Education Region"].str.title()
schools["Classification Group"] = schools["Classification Group"].str.title()

# Create new columns
schools["Address"] = schools["Street"] + ", " + schools["Suburb"] + " WA, " + schools["Postcode"].astype(str)
schools["Total_Students"] = schools[["KIN", "PPR", "Y01", "Y02", "Y03", "Y04", "Y05", "Y06", "Y07", "Y08", "Y09", "Y10", "Y11", "Y12"]].sum(axis=1)

# Rename Colums
schools = schools.rename(columns={
    "School Name": "School_Name",
    "Education Region": "Education_Region",
    "Classification Group": "Classification_Group",
    "KIN": "Students_KIN",
    "PPR": "Students_PPR",
    "Y01": "Students_Y01",
    "Y02": "Students_Y02",
    "Y03": "Students_Y03",
    "Y04": "Students_Y04",
    "Y05": "Students_Y05",
    "Y06": "Students_Y06",
    "Y07": "Students_Y07",
    "Y08": "Students_Y08",
    "Y09": "Students_Y09",
    "Y10": "Students_Y10",
    "Y11": "Students_Y11",
    "Y12": "Students_Y12"
})

# Keep only desired colums
schools = schools[[
    "Code",
    "School_Name",
    "Address",
    "Suburb",
    "Postcode",
    "Latitude",
    "Longitude",
    "Phone",
    "Education_Region",
    "Classification_Group",
    "Total_Students",
    "Students_KIN",
    "Students_PPR",
    "Students_Y01",
    "Students_Y02",
    "Students_Y03",
    "Students_Y04",
    "Students_Y05",
    "Students_Y06",
    "Students_Y07",
    "Students_Y08",
    "Students_Y09",
    "Students_Y10",
    "Students_Y11",
    "Students_Y12"   
]]

# Sort DataFrame by "Code" Column
schools = schools.sort_values(by="Code")

# Convert DataFrame to JSON and save file
schools_json = schools.to_json(orient="records")
with open("../data.json", 'w') as json_file:
    json_file.write(schools_json)

# Print confirmation message to user
print("JSON file created successfully")