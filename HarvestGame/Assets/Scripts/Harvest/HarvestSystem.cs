using UnityEngine;

public class HarvestSystem : MonoBehaviour
{
    public HarvesterController harvester;
    public HarvestConfig config;
    public HarvestCollector collector;
    public LayerMask grassLayer;
    public Transform cutPoint;           // نقطة القطع (أسفل الأداة)

    private float cutTimer;

    void Update()
    {
        HarvestToolData tool = harvester.CurrentTool;
        if (tool == null) return;

        // دوران الأداة بصرياً
        harvester.toolMount.Rotate(0f, 0f, tool.rotationSpeed * Time.deltaTime);

        cutTimer += Time.deltaTime;
        if (cutTimer >= tool.cutInterval)
        {
            cutTimer = 0f;
            float radius = tool.cutRadius > 0 ? tool.cutRadius : config.cutRadius;
            CutGrass(radius);
        }
    }

    void CutGrass(float radius)
    {
        Collider[] hits = Physics.OverlapSphere(cutPoint.position, radius, grassLayer);

        foreach (Collider hit in hits)
        {
            Grass grass = hit.GetComponent<Grass>();
            if (grass != null && grass.TryCut(config.destroyDelay))
            {
                collector.OnGrassCut(config.scorePerGrass);
            }
        }
    }
}
