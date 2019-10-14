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

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///db/bellybutton.sqlite"
#"postgresql://postgres:Txc08121984$@127.0.0.1:5432/LifeExpectancy"
db = SQLAlchemy(app)

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(db.engine, reflect=True)

# Save references to each table
Metadata = Base.classes.hea


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
    print(data)
    # Format the data to send as json
    keys  = ["Country","Bothsexes16","Male16","Female16","Bothsexes6016","Male6016","Female6016",
        "Bothsexes15","Male15","Female15","Bothsexes6015","Male6015","Female6015",
        "Bothsexes14","Male14","Female14","Bothsexes6014","Male6014","Female6014",
        "Bothsexes13","Male13","Female13","Bothsexes6013","Male6013","Female6013",
        "Bothsexes12","Male12","Female12","Bothsexes6012","Male6012","Female6012",
        "Bothsexes11","Male11","Female11","Bothsexes6011","Male6011","Female6011",
        "Bothsexes10","Male10","Female10","Bothsexes6010","Male6010","Female6010",
        "Bothsexes09","Male09","Female09","Bothsexes6009","Male6009","Female6009",
        "Bothsexes08","Male08","Female08","Bothsexes6008","Male6008","Female6008",
        "Bothsexes07","Male07","Female07","Bothsexes6007","Male6007","Female6007",
        "Bothsexes06","Male06","Female06","Bothsexes6006","Male6006","Female6006",
        "Bothsexes05","Male05","Female05","Bothsexes6005","Male6005","Female6005",
        "Bothsexes04","Male04","Female04","Bothsexes6004","Male6004","Female6004",
        "Bothsexes03","Male03","Female03","Bothsexes6003","Male6003","Female6003",
        "Bothsexes02","Male02","Female02","Bothsexes6002","Male6002","Female6002",
        "Bothsexes01","Male01","Female01","Bothsexes6001","Male6001","Female6001",
        "Bothsexes00","Male00","Female00","Bothsexes6000","Male6000","Female6000",
        "2015","2015capita","2014","2014capita","2013","2013capita","2012","2012capita",
        "2011","2011capita","2010","2010capita","2009","2009capita","2008","2008capita",
        "2007","2007capita","2006","2006capita","2005","2005capita","2004","2004capita",
        "2003","2003capita","2002","2002capita","2001","2001capita","2000","2000capita"]

    # jsondata = {}
    # for i in data.columns.length:
    #     jsondata.update({keys[i] : data.columns[i].values.tolist()})


    # jsondata = {
    #     "Country": data.Country.values.tolist(),
    #     "Bothsexes16": data.Bothsexes16.values.tolist(),
    #     "Male16": data.Male16.values.tolist(),
    #     "Female16":data.Female16.values.tolist(),
    #     "Bothsexes6016": data.Bothsexes6016.values.tolist(),
    #     "Male6016": data.Male6016.values.tolist(),
    #     "Female6016":data.Female6016.values.tolist(),
    #     "Bothsexes15": data.Bothsexes15.values.tolist(),
    #     "Male15": data.Male15.values.tolist(),
    #     "Female15":data.Female15.values.tolist(),
    #     "Bothsexes6015": data.Bothsexes6015.values.tolist(),
    #     "Male6015": data.Male6015.values.tolist(),
    #     "Female6015":data.Female6015.values.tolist(),
    # }
    # return jsonify(jsondata)


if __name__ == "__main__":
    app.run()




