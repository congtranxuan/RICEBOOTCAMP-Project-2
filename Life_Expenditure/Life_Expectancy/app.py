import os

import pandas as pd
import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine

from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)


#################################################
# Database Setup
#################################################

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///static/db/LifeExpectancy.db"

db = SQLAlchemy(app)

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(db.engine, reflect=True)

# Save references to each table
Metadata = Base.classes.LifeExpectancy


@app.route("/")
def index():
    """Return the homepage."""
    return render_template("index.html")


# @app.route("/names")
# def names():
#     """Return a list of sample names."""

#     # Use Pandas to perform the sql query
#     stmt = db.session.query(Metadata).statement
#     df = pd.read_sql_query(stmt, db.session.bind)

#     # Return a list of the column names (sample names)
#     return jsonify(list(df.columns)[2:])


# @app.route("/<year>")
# def sample_metadata(sample):
#     """Return the MetaData for a given sample."""
#     sel = [
#         Metadata.sample,
#         Metadata.ETHNICITY,
#         Metadata.GENDER,
#         Metadata.AGE,
#         Metadata.LOCATION,
#         Metadata.BBTYPE,
#         Metadata.WFREQ,
#     ]

#     results = db.session.query(*sel).filter(Metadata.sample == sample).all()

#     # Create a dictionary entry for each row of metadata information
#     sample_metadata = {}
#     for result in results:
#         sample_metadata["sample"] = result[0]
#         sample_metadata["ETHNICITY"] = result[1]
#         sample_metadata["GENDER"] = result[2]
#         sample_metadata["AGE"] = result[3]
#         sample_metadata["LOCATION"] = result[4]
#         sample_metadata["BBTYPE"] = result[5]
#         sample_metadata["WFREQ"] = result[6]

#     print(sample_metadata)
#     return jsonify(sample_metadata)


@app.route("/data")
def dataquery():
    
    stmt = db.session.query(Metadata).statement
    data = pd.read_sql_query(stmt, db.session.bind)
        
    # Format the data to send as json
    keys = ["Country","Continent",
        "Bothsexes16","Male16","Female16","Bothsexes15","Male15","Female15",
        "Bothsexes14","Male14","Female14","Bothsexes13","Male13","Female13",
        "Bothsexes12","Male12","Female12","Bothsexes11","Male11","Female11",
        "Bothsexes10","Male10","Female10","Bothsexes09","Male09","Female09",
        "Bothsexes08","Male08","Female08","Bothsexes07","Male07","Female07",
        "Bothsexes06","Male06","Female06","Bothsexes05","Male05","Female05",
        "Bothsexes04","Male04","Female04","Bothsexes03","Male03","Female03",
        "Bothsexes02","Male02","Female02","Bothsexes01","Male01","Female01",
        "Bothsexes00","Male00","Female00",
        "2015","2015capita","2014","2014capita","2013","2013capita","2012","2012capita",
        "2011","2011capita","2010","2010capita","2009","2009capita","2008","2008capita",
        "2007","2007capita","2006","2006capita","2005","2005capita","2004","2004capita",
        "2003","2003capita","2002","2002capita","2001","2001capita","2000","2000capita"]
    
    jsondata =[]
    for i in range(len(data["Country"])):
        newdata={}
        for j in range(len(keys)):
            newdata.update({keys[j] : data[keys[j]][i]})
        jsondata.append(newdata)
      
    return jsonify(jsondata)

if __name__ == "__main__":
    app.run()




