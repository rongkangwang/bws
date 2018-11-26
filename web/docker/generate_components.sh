#!/bin/sh

cat << EOF
{
    "components": {
        "items": [
            {
                "name": "Ads",
                "subcomponents": {
                    "items": [
                        {
                            "name": "Placements",
                            "endpoint": "placements",
                            "search_fields": ["id"],
                            "show_types":["all","basic","industry","price"],
                            "show_fields": ["id", "mrm_id" ,"name"],
                            "show_field_titles": ["ID", "MRM", "Name"],
                            "service": "$ORDER_SERVICE_HOST:$ORDER_SERVICE_PORT",
                            "mrm_ui": "https://mrm.freewheel.tv/ui/${network_id}/campaign/campaigns/${campaign_id}/edit?step=traffic_required#insertion_order_id=${insertion_order_id}&placement_id=${id}"
                        },
                        {
                            "name": "Ad&Creatives",
                            "endpoint": "creatives",
                            "search_fields": ["id"],
                            "search_params": ["fields","expand"],
                            "dependencies":[
                                {"dependency":"creative_renditions"}
                            ],
                            "show_types" : [],
                            "show_fields": ["id"]
                        },
                        {
                            "name": "Creative Renditions",
                            "search_fields": ["id"],
                            "show_fields": ["id"]
                        },
                        {
                            "name": "PlacementPacingCurve",
                            "search_fields": ["id"],
                            "show_fields": ["id"]
                        },
                        {
                            "name": "Ad Product(ad unit)",
                            "search_fields": ["id"],
                            "show_fields": ["id"],
                            "service": "order_service",
                            "endpoint": "ad_units"
                        }
                    ]
                }
            },
            {
                "name": "Inventory",
                "subcomponents": {
                    "items": [
                        {
                            "name": "Video Assets",
                            "search_fields": ["id"],
                            "show_fields": ["id","title1"],
                            "service": "$INVENTORY_SERVICE_HOST:$INVENTORY_SERVICE_PORT",
                            "endpoint": "videos",
                                "sub_resources": [
                                {"resource": "parent_video_groups"}
                            ]
                        }
                    ]
                }
            }
        ]
    }
}

EOF
