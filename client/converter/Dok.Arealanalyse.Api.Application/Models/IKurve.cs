﻿using GeoJSON.Text.Geometry;
using OSGeo.OGR;

namespace Dok.Arealanalyse.Api.Application.Models;

public interface IKurve
{
    int SequenceNumber { get; set; }
    Geometry GetGeometry(int? srcEpsg, bool reverse = false);
    LineString ToGeoJson(int? srcEpsg);
}